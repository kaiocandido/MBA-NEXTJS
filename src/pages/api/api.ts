import type { NextApiRequest, NextApiResponse } from 'next';

interface Client {
  id: number;
  nome: string;
}

let clients: Client[] = [
  { id: 1, nome: "kaio" }
];

// Handler da API
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(clients);
      break;

    case 'POST':
      const { nome } = req.body;
      if (!nome) {
        res.status(400).json({ message: "Nome é obrigatório." });
        return;
      }

      const newClient: Client = {
        id: clients.length + 1,
        nome: nome
      };
      clients.push(newClient);
      res.status(201).json(newClient);
      break;

    case 'PUT':
      const idToUpdate = parseInt(req.query.id as string);
      const clientIndex = clients.findIndex(c => c.id === idToUpdate);

      if (clientIndex === -1) {
        res.status(404).json({ message: "Cliente não encontrado." });
        return;
      }

      const { nome: newName } = req.body;
      if (!newName) {
        res.status(400).json({ message: "Nome é obrigatório." });
        return;
      }

      clients[clientIndex].nome = newName;
      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
      break;

    case 'DELETE':
      const idToDelete = parseInt(req.query.id as string);
      clients = clients.filter(c => c.id !== idToDelete);
      res.status(200).json({ message: "Usuário removido com sucesso!" });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
