import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDataSource } from '../functions/datasource';
import { findMatches } from '../modules/match/match-service';
import { authenticateToken } from '../functions/auth';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const user = await authenticateToken(req, res)
    await initializeDataSource();

    switch (req.method) {
      case 'GET':
        const skills = await findMatches(user);
        res.status(200).json(skills);
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
