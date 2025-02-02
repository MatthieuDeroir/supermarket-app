import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

type DashboardCardProps = {
  name: string;
  url: string;
  image?: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ name, url, image }) => {
  return (
    <Card sx={{ flex: 1 }}>
      <CardActionArea href={url} target="_blank">
        <CardMedia
          component="img"
          height="180"
          image={image || '/assets/images/placeholder-image.webp'}
          alt={name}
        />
        <CardContent>
          <Typography variant="body1" fontWeight="bold">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DashboardCard;
