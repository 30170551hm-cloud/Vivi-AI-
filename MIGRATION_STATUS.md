# Vivi AI — Migration Status

## Architecture
- **Runtime**: Firebase (Auth, Firestore, Storage, Functions)
- **Deployment**: Vercel
- **Source of truth**: This repository (main branch)
- **Base44 dependency**: NONE (fully decoupled; only a compatibility bridge remains)

## Backend Functions (functions/index.js)
| Endpoint | Purpose |
|---|---|
| callLLM | LLM inference (OpenAI / Gemini) |
| generateSpeech | Text-to-speech |
| generateImage | AI image generation |
| getRepoTree | List repo files |
| getRepoFile | Read repo file |
| proposeRepoChanges | Propose code edits (allowlist-gated) |
| approveRepoChanges | Approve and apply proposed edits |

## Frontend Modules (30 registered)
ViviCore, ViviVoice, ViviAvatar, ViviMemory, ViviKnowledge, ViviIntegrations,
ViviNotifications, ViviSettings, ViviFounderConsole, ViviSecurity, ViviApi,
ViviLogger, ViviRealtimeFacts, ViviVenezuela, ViviVenezuelaManual, ViviVAD,
ViviTOOR, ViviBaseBrain, ViviVDE, ViviFounderAuth, ViviReasoning,
ViviEmotionEngine, ViviVisionEngine, ViviAudioEngine, ViviLearningEngine,
ViviConversationEngine, ViviCodeAnalyzer, ViviPermissionManager,
ViviUniversity, ViviAnalytics

## Firebase Abstraction Layer (src/lib/)
| File | Replaces |
|---|---|
| backendClient.js | legacy `@/api/base44Client` contract |
| firebase.js | Base44 SDK init |
| firebaseAuthAdapter.js | base44.auth.* |
| firebaseEntities.js | base44.entities.* |
| firebaseStorageAdapter.js | base44.integrations.Core.UploadFile |
| llmProviders.js | base44.integrations.Core.InvokeLLM |
| aiProvider.js | base44.integrations.Core.* |
| authClient.js | base44.auth.* |

## Firestore Collections
users, memories, conversations, chat_messages, tool_actions,
improvement_proposals, certification_tests, repo_change_audits,
workspace_artifacts, action_logs, knowledge_entries, dev_tasks,
project_memories, financial_transactions, integration_requests,
integration_connections

## Pages (12)
Login, Register, ForgotPassword, ResetPassword, Vivi, FounderPanel,
VoiceDiagnostic, Academia, SelfImprovement, VDEConsole, Chat, Memoria

## Migration Status
- [x] Firebase abstraction layer
- [x] Core modules (27 original)
- [x] Ported modules: ViviPermissionManager, ViviUniversity, ViviAnalytics
- [x] Firebase Functions backend (7 endpoints)
- [x] Vercel deployment config
- [x] Firestore security rules (16 collections)
- [x] CI/CD workflows
- [x] README with deployment guide
- [x] Module registration in bootstrap
- [x] Entity adapter updated with new collections
- [x] Removed unused Base44 configuration and entity artifacts
- [x] Verified npm install plus typecheck, lint, and build locally
- [ ] Port remaining advanced modules (ViviSelfEvolution, ViviCertification, etc.)
- [ ] Deploy to Vercel
- [ ] Configure Firebase secrets (OPENAI_API_KEY, GEMINI_API_KEY, GITHUB_TOKEN)

## Recent Commits
- feat: port ViviPermissionManager to Firebase architecture
- feat: port ViviUniversity to Firebase architecture
- feat: port ViviAnalytics to Firebase architecture
- feat: register new modules in bootstrap
- feat: add entity collections to Firestore adapter
- feat: add Firestore rules for new collections
- docs: update README with deployment guide
- docs: add migration status document

## Last Updated
2026-07-16
