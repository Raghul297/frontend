import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
} from "@mui/material";

interface NewsCardProps {
  title: string;
  summary: string;
  topic: string;
  sentiment: number;
  source: string;
  entities: {
    states: string[];
    people: string[];
  };
  timestamp: string;
}

const getSentimentColor = (sentiment: number): string => {
  if (sentiment > 0.5) return "#4caf50";
  if (sentiment > 0) return "#8bc34a";
  if (sentiment === 0) return "#9e9e9e";
  if (sentiment > -0.5) return "#ff9800";
  return "#f44336";
};

const NewsCard = ({
  title,
  summary,
  topic,
  sentiment,
  source,
  entities,
  timestamp,
}: NewsCardProps) => {
  const sentimentPercentage = ((sentiment + 1) / 2) * 100;
  const sentimentColor = getSentimentColor(sentiment);

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {summary}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip label={topic} color="primary" size="small" />
          <Chip label={source} color="secondary" size="small" />
          {entities.states.map((state) => (
            <Chip key={state} label={state} variant="outlined" size="small" />
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="body2">Sentiment:</Typography>
          <Tooltip title={`Sentiment Score: ${sentiment}`}>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={sentimentPercentage}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: sentimentColor,
                  },
                }}
              />
            </Box>
          </Tooltip>
        </Box>

        <Typography variant="caption" color="text.secondary">
          {new Date(timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
