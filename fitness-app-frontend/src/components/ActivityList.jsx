import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import { getActivities } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ActivityList = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActivities = async () => {
        const userId = localStorage.getItem('userid');
        if (!userId) {
            setError("User not logged in");
            setLoading(false);
            return;
        }

        try {
            const response = await getActivities(userId);
            setActivities(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching activities:", err);
            setError("Failed to load activities");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
        
        // Listen for custom event to refresh list when new activity is added
        window.addEventListener('activityAdded', fetchActivities);
        return () => window.removeEventListener('activityAdded', fetchActivities);
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Your Activities
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {activities.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                    No activities found. Start moving!
                </Typography>
            ) : (
                <List>
                    {activities.map((activity) => (
                        <ListItem key={activity.id} disablePadding divider>
                            <ListItemButton onClick={() => navigate(`/activities/${activity.id}`)}>
                                <ListItemText
                                    primary={`${activity.type} - ${activity.duration} mins`}
                                    secondary={`${activity.caloriesBurned} calories burned • ${activity.startTime ? new Date(activity.startTime).toLocaleString() : 'Recent'}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default ActivityList;