import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const LayoutRenderer = ({ layout }) => {
  return (
    <div>
      {layout.map((row, rowIndex) => (
        <Grid container key={rowIndex} spacing={2}>
          {row.map((tile, tileIndex) => (
            <Grid item key={tileIndex} xs={tile.size}>
              <Paper style={{ backgroundColor: tile.color, padding: '20px' }}>
                <Typography variant="body1">{tile.content}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </div>
  );
};

export default LayoutRenderer;
