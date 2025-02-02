import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { User } from '@common/defs/types/user';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import UserDetailsModal from '@modules/users/components/UserDetailsModal';
import { useRouter } from 'next/router';

const Users: React.FC = () => {
  const router = useRouter();
  type UserRow = {
    id: number;
    nom: string;
    email: string;
    role: string;
    afficherMotDePasse?: boolean;
  };

  type Role = {
    role_id: number;
    nom: string;
  };

  const [rows, setRows] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleShowUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'nom', headerName: 'Nom', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'Email', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'role', headerName: 'Rôle', flex: 2, headerAlign: 'center', align: 'center' },
    {
      field: 'motDePasse',
      headerName: 'Mot de passe',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            const newRows = rows.map((row) => {
              if (row.id === params.row.id) {
                return { ...row, afficherMotDePasse: !row.afficherMotDePasse };
              }
              return row;
            });
            setRows(newRows);
          }}
        >
          {params.row.afficherMotDePasse ? params.row.motDePasse : '••••••••'}
        </Typography>
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: '10%',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <IconButton
            onClick={() => {
              router.push(`/user/${params.row.id}`);
            }}
            size="small"
          >
            <VisibilityIcon color="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchAllUsers = async () => {
    try {
      const rolesResponse = await makeApiRequest(apiRoutes.Roles.GetAll);
      const rolesData = Array.isArray(rolesResponse) ? rolesResponse : [];
      setRoles(rolesData);
      const response = await makeApiRequest(apiRoutes.Users.GetAll);
      if (Array.isArray(response)) {
        const mappedData = response.map((item: User, index) => ({
          id: item.user_id ?? `temp-${index}`,
          nom: `${item.first_name ?? 'Pas de prénom'} ${item.last_name ?? 'Pas de nom'}`,
          email: item.email ?? 'Pas d’email',
          motDePasse: item.password ?? 'Pas de mot de passe',
          role: rolesData.find((role) => role.role_id === item.role_id)?.nom ?? 'N/A',
        }));

        setRows(mappedData);
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l’API', error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <Typography variant="h3">Utilisateurs</Typography>
        <DataGrid rows={rows} columns={columns} />
      </Box>
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
};

export default Users;
