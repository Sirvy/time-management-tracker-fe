import { http, HttpResponse } from 'msw';

interface User {
    username: string;
    password: string;
}

const users: User[] = [];

const createMockJwt = () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 10 }));
    const signature = 'mocked-signature';
    return `${header}.${payload}.${signature}`;
};

const mockCategories = [
    { _id: '1', name: 'Work', color: '#FF5733' },
    { _id: '2', name: 'Personal', color: '#33C1FF' },
    { _id: '3', name: 'Fitness', color: '#75FF33' }
];

const mockTasks = [];

const verifyAccessToken = (req: any) => {
    const authHeader = req.request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    try {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
        return true;
    } catch {
        return false;
    }
};

const getRefreshTokenFromCookie = (req: any) => {
    const cookie = req.request.headers.get('Cookie');
    if (!cookie) return null;
    const match = cookie.match(/refreshToken=([^;]+)/);
    return match ? match[1] : null;
};

const verifyRefreshToken = (req: any) => {
    const token = getRefreshTokenFromCookie(req);
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    try {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
        return true;
    } catch {
        return false;
    }
};

export const handlers = [
    http.get('/test', async (req) => {
        return HttpResponse.json({
            'message': 'Hello'
        });
    }),
    http.post('/register', async (req) => {
        const request = await req.request.json();
        const { username, password } = request as { username: string; password: string };
        if (users.find(u => u.username === username)) {
            return HttpResponse.json({ message: 'User already exists' }, { status: 400 });
        }
        users.push({ username, password });
        console.log(users);
        return HttpResponse.json({ message: 'Registration successful' });
    }),
    http.post('/login', async <any>(req) => {
        const request = await req.request.json();
        const { username, password } = request as { username: string; password: string };
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
        return HttpResponse.json({ accessToken: createMockJwt() });
    }),
    http.post('/auth/refresh-token', async <any>(req) => {
        if (!verifyRefreshToken(req)) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const newAccessToken = createMockJwt();
        return HttpResponse.json({ accessToken: newAccessToken });
    }),
    http.get('/user/categories', async <any>(req) => {
        if (!verifyAccessToken(req)) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(mockCategories);
    }),
    http.get('/tasks', async <any>(req) => {
        if (!verifyAccessToken(req)) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(mockTasks);
    }),
    http.post('/tasks', async <Task, any>(req) => {
        if (!verifyAccessToken(req)) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const request = await req.request.json();
        const newTask = request as Task;
        console.log(newTask);
        const createdTask = {
            ...newTask,
            _id: Date.now().toString(),
            date: new Date(newTask.date)
        };
        mockTasks.push(createdTask);
        return HttpResponse.json(createdTask, { status: 201 });
    })
];
