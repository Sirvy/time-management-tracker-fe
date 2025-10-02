import { http, HttpResponse } from 'msw';
import { mockStorage } from './mockStorage';


interface User {
    username: string;
    password: string;
}

let userIsLoggedIn = true;

if (mockStorage.get('users') === null) {
    mockStorage.set('users', []);
}
if (mockStorage.get('categories') === null) {
    mockStorage.set('categories', [
        { _id: '1', name: 'Work', color: '#FF5733' },
        { _id: '2', name: 'Personal', color: '#33C1FF' },
        { _id: '3', name: 'Fitness', color: '#75FF33' }
    ]);
}
if (mockStorage.get('tasks') === null) {
    mockStorage.set('tasks', []);
}

const users: User[] = mockStorage.get('users') || [];
let categories = mockStorage.get('categories') || [];
let tasks = mockStorage.get('tasks') || [];

const createMockJwt = () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 10 }));
    const signature = 'mocked-signature';
    return `${header}.${payload}.${signature}`;
};

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

const verifyRefreshToken = (req: any) => {
    return userIsLoggedIn;
};

export const handlers = [
    http.get('/test', async (req) => {
        return HttpResponse.json({
            'message': 'Hello'
        });
    }),
    http.post('/auth/check', async <any>(req) => {
        if (!verifyAccessToken(req)) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json();
    }),
    http.post('/register', async (req) => {
        const request = await req.request.json();
        const { username, password, captchaValue } = request as {
            username: string;
            password: string,
            captchaValue: string
        };
        if (!captchaValue || captchaValue !== '4') {
            return HttpResponse.json({ message: 'Captcha validation failed' }, { status: 400 });
        }
        if (users.find(u => u.username === username)) {
            return HttpResponse.json({ message: 'User already exists' }, { status: 400 });
        }
        mockStorage.update('users', (current) => [...(current || []), { username, password }]);
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
    http.post('/logout', async <any>(req) => {
        // TODO invalidate refresh token
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
        return HttpResponse.json(categories);
    }),
    http.get('/tasks', async <any>(req) => {
        if (!verifyAccessToken(req)) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        return HttpResponse.json(tasks);
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
        tasks.push(createdTask);
        return HttpResponse.json(createdTask, { status: 201 });
    })
];
