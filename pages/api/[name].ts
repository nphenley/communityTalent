import { NextApiRequest, NextApiResponse } from 'next';
//TODO set up opensea api call using this
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.body as { query: string };
  res.send(query);
};
