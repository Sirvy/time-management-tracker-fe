import { TextField } from '@mui/material';
import React, { useState } from 'react';

interface SimpleCaptchaProps {
    onChange: (value: string) => void;
}

export const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ onChange }) => {

    const generateAnimal = () => {
        const animals = ['Cat', 'Dog', 'Elephant', 'Giraffe', 'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Rabbit', 'Deer', 'Zebra'];
        return animals[Math.floor(Math.random() * animals.length)];
    };

    const [animal] = useState(generateAnimal());

    return <TextField
        margin="normal"
        required
        fullWidth
        id="captcha"
        name="captcha"
        label={`How many legs does a typical ${animal} have?`}
        onChange={(e) => onChange(e.target.value)}
    />;
};