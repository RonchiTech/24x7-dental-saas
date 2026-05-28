import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { prisma } from '../db';
import { MeasurementInput, ViewerStateJson } from '../types';

const router = Router();

router.use(requireAuth);

router.get('/:studyUID', async (req: AuthRequest, res) => {
  const studyUID = req.params.studyUID as string;
  const state = await prisma.viewerState.findUnique({
    where: { userId_studyInstanceUID: { userId: req.user!.userId, studyInstanceUID: studyUID } },
    include: { measurements: true },
  });
  if (!state) { res.status(404).json({ error: 'No saved state' }); return; }
  res.json(state);
});

router.put('/:studyUID', async (req: AuthRequest, res) => {
  const studyUID = req.params.studyUID as string;
  const { stateJson, measurements } = req.body as { stateJson: ViewerStateJson; measurements: MeasurementInput[] };
  const state = await prisma.viewerState.upsert({
    where: { userId_studyInstanceUID: { userId: req.user!.userId, studyInstanceUID: studyUID } },
    update: { stateJson: stateJson as object },
    create: { userId: req.user!.userId, studyInstanceUID: studyUID, stateJson: stateJson as object },
  });
  if (measurements?.length) {
    await prisma.measurement.deleteMany({ where: { viewerStateId: state.id } });
    await prisma.measurement.createMany({ data: measurements.map(m => ({ ...m, viewerStateId: state.id })) });
  }
  const updated = await prisma.viewerState.findUnique({ where: { id: state.id }, include: { measurements: true } });
  res.json(updated);
});

router.get('/:studyUID/export', async (req: AuthRequest, res) => {
  const studyUID = req.params.studyUID as string;
  const state = await prisma.viewerState.findUnique({
    where: { userId_studyInstanceUID: { userId: req.user!.userId, studyInstanceUID: studyUID } },
    include: { measurements: true },
  });
  if (!state) { res.status(404).json({ error: 'No saved state' }); return; }
  res.setHeader('Content-Disposition', `attachment; filename="measurements-${studyUID}.json"`);
  res.json(state.measurements);
});

export default router;
