import { User } from '../models/user';
import { Menu } from '../models/menu.model';

export const getMenuByUserId = async (req: any, res: any) => {
  const { userId } = req.params;

  try {
    const usuario = await User.findById(userId);

    if (!usuario || !usuario.role || usuario.role.length === 0) {
      return res.status(404).json({ message: 'Usuario o rol no encontrado' });
    }

    const menus = await Menu.find({
      roles: { $in: usuario.role } 
    }).select('title path icon');

    res.json(menus);

  } catch (error) {
    console.error('Error al obtener menú por usuario:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};
