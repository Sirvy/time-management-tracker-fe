export default {
    build: {
        rollupOptions: {
            input: 'src/index.tsx'
        }
    },
    server: {
        port: 5173, // or any fixed port
        strictPort: true // fail if port is taken instead of auto-incrementing
    }
};
