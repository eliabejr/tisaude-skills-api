// /src/api/users.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDataSource } from '../functions/datasource';
import { createUser, getUsers, updateUser, deleteUser } from '../modules/users/users-service';
import { authenticateToken } from '../functions/auth';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const user = await authenticateToken(req, res);
    req.body.userId = user
    await initializeDataSource();

    switch (req.method) {
      case 'POST':
        const { name, email } = req.body;
        if (!name || !email) {
          return res.status(400).json({ error: 'Missing name or email in request body' });
        }
        const newUser = await createUser(name, email);
        res.status(201).json(newUser);
        break;

      case 'GET':
        const users = await getUsers();
        res.status(200).json(users);
        break;

      case 'PATCH':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Missing user id in request body' });
        }
        const updatedUser = await updateUser(id, updateData.name, updateData.email);
        res.status(200).json(updatedUser);
        break;

      case 'DELETE':
        const { userId } = req.body;
        if (!userId) {
          return res.status(400).json({ error: 'Missing user id in request body' });
        }
        await deleteUser(userId);
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
