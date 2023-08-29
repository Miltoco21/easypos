/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { CircularProgress,  } from '@mui/material';



export default function Card2() {
  return (
    <Card>
      <CardContent>
        
        <CardContent>
          <Typography variant="body-md">Ventas - Compras </Typography>
          <Typography variant="h2">$ 432.6M</Typography>
        </CardContent>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small">
          Add to Watchlist
        </Button>
        <Button variant="contained" size="small">
          See breakdown
        </Button>
      </CardActions>
    </Card>
  );
}