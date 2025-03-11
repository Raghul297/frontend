import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import NewsCard from "./NewsCard";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface NewsArticle {
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

const NewsList = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  useEffect(() => {
    console.log("Component mounted");
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      console.log("Fetching news...");
      const response = await axios.get(
        "https://backend-1518.vercel.app/api/news"
      );
      console.log("News data received:", response.data);
      setNews(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.message || "Failed to fetch news");
      setLoading(false);
    }
  };

  console.log("Current state:", { loading, error, newsCount: news.length });

  const filteredNews = news.filter((article) => {
    const topicMatch =
      selectedTopic === "all" || article.topic === selectedTopic;
    const sourceMatch =
      selectedSource === "all" || article.source === selectedSource;
    return topicMatch && sourceMatch;
  });

  const topics = [...new Set(news.map((article) => article.topic))];
  const sources = [...new Set(news.map((article) => article.source))];

  const topicData = {
    labels: topics,
    datasets: [
      {
        data: topics.map(
          (topic) => news.filter((article) => article.topic === topic).length
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading news...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error" variant="h5" gutterBottom>
          Error Loading News
        </Typography>
        <Typography color="error">{error}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please make sure the backend server is running on
          https://backend-1518.vercel.app
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Latest News
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Found {filteredNews.length} articles
          </Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Filter by Topic</InputLabel>
              <Select
                value={selectedTopic}
                label="Filter by Topic"
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <MenuItem value="all">All Topics</MenuItem>
                {topics.map((topic) => (
                  <MenuItem key={topic} value={topic}>
                    {topic}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Filter by Source</InputLabel>
              <Select
                value={selectedSource}
                label="Filter by Source"
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <MenuItem value="all">All Sources</MenuItem>
                {sources.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {news.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Topics Distribution
              </Typography>
              <Pie data={topicData} />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={9}>
          {filteredNews.length === 0 ? (
            <Typography variant="h6" textAlign="center">
              No news articles found
            </Typography>
          ) : (
            filteredNews.map((article, index) => (
              <NewsCard key={index} {...article} />
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsList;
