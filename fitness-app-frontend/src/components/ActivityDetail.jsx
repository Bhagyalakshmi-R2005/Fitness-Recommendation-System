import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Lightbulb from '@mui/icons-material/Lightbulb';
import Security from '@mui/icons-material/Security';
import ArrowBack from '@mui/icons-material/ArrowBack';
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import { getActivity, getActivityDetail } from '../services/api';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activityRes, recommendationRes] = await Promise.all([
                    getActivity(id),
                    getActivityDetail(id)
                ]);
                setActivity(activityRes.data);
                setRecommendation(recommendationRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load activity details or recommendations.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (error) return (
        <Box sx={{ p: 3 }}>
            <Typography color="error">{error}</Typography>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>Back</Button>
        </Box>
    );

    return (
        <Box sx={{ p: 2 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
                Back to Activities
            </Button>

            <Grid container spacing={3}>
                {/* Activity Summary */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <FitnessCenter sx={{ mr: 1 }} /> Activity Details
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1"><strong>Type:</strong> {activity?.type}</Typography>
                            <Typography variant="subtitle1"><strong>Duration:</strong> {activity?.duration} minutes</Typography>
                            <Typography variant="subtitle1"><strong>Calories Burned:</strong> {activity?.caloriesBurned} kcal</Typography>
                            <Typography variant="subtitle1"><strong>Date:</strong> {activity?.startTime ? new Date(activity.startTime).toLocaleString() : 'N/A'}</Typography>
                        </Box>
                        {activity?.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Additional Metrics</Typography>
                                {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                                    <Chip key={key} label={`${key}: ${value}`} sx={{ mr: 1, mt: 1 }} />
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* AI Recommendation */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 3, bgcolor: '#f8faff', border: '1px solid #e3f2fd' }}>
                        <Typography variant="h5" gutterBottom color="secondary" sx={{ fontWeight: 'bold' }}>
                            AI Coach Recommendation
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        {!recommendation ? (
                            <Typography variant="body1" color="textSecondary">
                                No recommendation available yet. AI is still processing your data.
                            </Typography>
                        ) : (
                            <>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3 }}>
                                    "{recommendation.recommendation}"
                                </Typography>

                                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                                    <CheckCircle sx={{ mr: 1 }} /> Areas for Improvement
                                </Typography>
                                <List dense>
                                    {recommendation.improvements?.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>

                                <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <Lightbulb sx={{ mr: 1 }} /> Suggestions for Next Time
                                </Typography>
                                <List dense>
                                    {recommendation.suggestions?.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>

                                <Typography variant="h6" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <Security sx={{ mr: 1 }} /> Safety Advice
                                </Typography>
                                <List dense>
                                    {recommendation.safety?.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ActivityDetail;