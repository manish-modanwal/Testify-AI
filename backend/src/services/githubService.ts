import { Octokit } from '@octokit/rest';

export const getRepositories = async (token: string) => {
  const octokit = new Octokit({ auth: token });
  
  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      type: 'all',
      sort: 'updated',
    });
    return data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw new Error('Failed to fetch repositories from GitHub.');
  }
};