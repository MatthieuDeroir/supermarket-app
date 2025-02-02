import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { User } from '@common/defs/types/user';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';

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
    name: string;
  };

  const [rows, setRows] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

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
              router.push(`/users/${params.row.id}`);
            }}
            size="small"
          >
            <VisibilityIcon color="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchRoles = async () => {
    try {
      const rolesResponse = await makeApiRequest(apiRoutes.Roles.GetAll);
      return Array.isArray(rolesResponse) ? rolesResponse : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles', error);
      return [];
    }
  };

  const fetchUsers = async (rolesData: Role[]) => {
    try {
      const response = await makeApiRequest(apiRoutes.Users.GetAll);
      console.log('roles', rolesData);
      console.log('roles useEffect', roles);
      console.log('response', response);
      if (Array.isArray(response)) {
        const mappedData = response.map((item: User, index) => ({
          id: item.user_id ?? `temp-${index}`,
          nom: `${item.first_name ?? 'Pas de prénom'} ${item.last_name ?? 'Pas de nom'}`,
          email: item.email ?? 'Pas d’email',
          motDePasse: item.password ?? 'Pas de mot de passe',
          role: rolesData.find((role) => role.role_id === item.role_id)?.name ?? 'N/A',
        }));

        setRows(mappedData);
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
    }
  };

  const fetchAllUsers = async () => {
    const rolesData = await fetchRoles();
    setRoles(rolesData);
    await fetchUsers(rolesData);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <Box mb={2}>
          <Typography variant="h3">Utilisateurs</Typography>
          <IconButton
            onClick={() => router.push('/users/add')}
            size="small"
            sx={{ float: 'right', backgroundColor: 'primary.light', borderRadius: 1 }}
          >
            <AddIcon sx={{ color: 'primary.dark' }} />
          </IconButton>
        </Box>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </>
  );
};

export default Users;
