import React, { useState } from 'react'
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { addActivity } from '../services/api';
const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {}
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const activityToSubmit = {
                ...activity,
                startTime: new Date().toISOString()
            };
            await addActivity(activityToSubmit);
            // Dispatch custom event to notify ActivityList to refresh
            window.dispatchEvent(new Event('activityAdded'));
            setActivity({
                type: "RUNNING",
                duration: "",
                caloriesBurned: ""
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Activity Type</InputLabel>
                <Select
                    value={activity.type}
                    onChange={(e) => setActivity({ ...activity, type: e.target.value })}>
                    <MenuItem value="RUNNING">Running</MenuItem>
                    <MenuItem value="CYCLING">Cycling</MenuItem>
                    <MenuItem value="WALKING">Walking</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Duration (minutes)"
                type="number"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
                required
            />
            <TextField
                label="Calories burned"
                type="number"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Add Activity
            </Button>
        </Box>
    )
}

export default ActivityForm