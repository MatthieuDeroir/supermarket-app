import { Card, CardContent, Typography } from '@mui/material';

type InfoCardProps = {
  title: string;
  value: string | number;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <Card
      sx={{
        minWidth: 100,
        p: 1,
        flex: 1,
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
