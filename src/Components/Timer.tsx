import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const Timer: React.FC = () => {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning) {
            startTimeRef.current = Date.now() - time * 1000; // Adjust for the elapsed time
            interval = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = Math.floor((currentTime - startTimeRef.current) / 1000);
                setTime(elapsedTime);
            }, 1000);
        } else if (!isRunning && interval && time !== 0) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, time]);

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`;
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body1" component="div" gutterBottom>
                {formatTime(time)}
            </Typography>
            <Box>
                <Button
                    variant={isRunning ? 'outlined' : 'contained'}
                    onClick={handleStartPause}
                    sx={{
                        mr: 2,
                        color: isRunning ? 'inherit' : 'primary.contrastText',
                        bgcolor: isRunning ? 'white' : 'primary.main'
                    }}
                >
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default Timer;
