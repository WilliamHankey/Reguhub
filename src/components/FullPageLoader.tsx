import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import logo from '../assets/reguhublogo.svg';

const FullPageLoader: React.FC = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}
        >
            <motion.img
                src={logo}
                alt="Loading..."
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain'
                }}
            />
        </Box>
    );
};

export default FullPageLoader; 