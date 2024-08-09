import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDataSource } from '../functions/datasource';
import { createSkill, getSkills, updateSkill, deleteSkill } from '../modules/skills/skills-service';
import { authenticateToken } from '../functions/auth';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const user = await authenticateToken(req, res)
    req.body.userId = user
    await initializeDataSource();

    switch (req.method) {
      case 'POST':
        const { name, role } = req.body;
        if (!name || !role) {
          return res.status(400).json({ error: 'missing_skill_name_or_name' });
        }
        const newSkill = await createSkill(name, role, req.body.userId);
        res.status(201).json(newSkill);
        break;

      case 'GET':
        const skills = await getSkills();
        res.status(200).json(skills);
        break;

      case 'PATCH':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'missing_skill_id' });
        }
        const updatedSkill = await updateSkill(id, req.body.userId, updateData.name, updateData.description);
        res.status(200).json(updatedSkill);
        break;

      case 'DELETE':
        const { skillId } = req.body;
        if (!skillId) {
          return res.status(400).json({ error: 'missing_skill_id' });
        }
        await deleteSkill(skillId, req.body.userId);
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
