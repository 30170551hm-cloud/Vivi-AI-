// githubProvider.js — Cliente de las Cloud Functions getRepoTree/getRepoFile
// (ver functions/index.js). El token de GitHub vive solo en el backend
// (Cloud Functions secret GITHUB_TOKEN); este módulo nunca lo ve ni lo maneja.
//
// ESTADO: escrito y verificado sintácticamente. NO desplegado — requiere
// GITHUB_TOKEN configurado como secret en un proyecto Firebase real.

import { getFunctions, httpsCallable } from 'firebase/functions';
import { app as firebaseApp } from './firebase';

/** @type {import('firebase/app').FirebaseApp | undefined} */
const typedFirebaseApp = firebaseApp;

const functions = getFunctions(typedFirebaseApp);
const getRepoTreeFn = httpsCallable(functions, 'getRepoTree');
const getRepoFileFn = httpsCallable(functions, 'getRepoFile');

export const GitHubProvider = {
  /**
   * @param {{owner: string, repo: string, branch?: string}} params
   * @returns {Promise<{files: {path:string, type:string, size:number}[], truncated:boolean}>}
   */
  async getRepoTree({ owner, repo, branch }) {
    const { data } = await getRepoTreeFn({ owner, repo, branch });
    return /** @type {{files: {path:string, type:string, size:number}[], truncated:boolean}} */ (data);
  },

  /**
   * @param {{owner: string, repo: string, path: string, branch?: string}} params
   * @returns {Promise<{path:string, content:string, sha:string, size:number}>}
   */
  async getRepoFile({ owner, repo, path, branch }) {
    const { data } = await getRepoFileFn({ owner, repo, path, branch });
    return /** @type {{path:string, content:string, sha:string, size:number}} */ (data);
  },
};
