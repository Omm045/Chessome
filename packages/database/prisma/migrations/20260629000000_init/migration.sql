-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WHITE_WIN', 'BLACK_WIN', 'DRAW', 'ONGOING');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkerStatus" AS ENUM ('IDLE', 'BUSY', 'OFFLINE');

-- CreateEnum
CREATE TYPE "OutboxEventStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('SUPABASE', 'CHESSCOM', 'LICHESS');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('DARK', 'LIGHT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "BoardTheme" AS ENUM ('DEFAULT', 'GREEN', 'WOOD');

-- CreateEnum
CREATE TYPE "EvalDisplay" AS ENUM ('GRAPH', 'BAR', 'NONE');

-- CreateEnum
CREATE TYPE "AnalysisType" AS ENUM ('GAME', 'POSITION', 'PUZZLE', 'STUDY');

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "white" VARCHAR NOT NULL,
    "black" VARCHAR NOT NULL,
    "date" DATE NOT NULL,
    "result" "GameResult" NOT NULL,
    "initial_fen" VARCHAR NOT NULL,
    "pgn_text" TEXT NOT NULL,
    "move_count" INTEGER NOT NULL,
    "eco" VARCHAR,
    "opening" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "game_id" UUID NOT NULL,
    "depth" INTEGER NOT NULL,
    "engine" VARCHAR NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "analysis_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "move_evaluations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "analysis_id" UUID NOT NULL,
    "fen" VARCHAR NOT NULL,
    "depth_achieved" INTEGER NOT NULL,
    "score_cp" INTEGER,
    "score_mate" INTEGER,
    "pv" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "move_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_type" VARCHAR NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxEventStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" VARCHAR NOT NULL,
    "worker_name" VARCHAR NOT NULL,
    "processed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth_provider" "AuthProvider" NOT NULL,
    "auth_provider_id" TEXT NOT NULL,
    "email" VARCHAR,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "username" VARCHAR,
    "display_name" VARCHAR,
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "preferences_version" INTEGER NOT NULL DEFAULT 1,
    "theme" "Theme" NOT NULL DEFAULT 'DARK',
    "board_theme" "BoardTheme" NOT NULL DEFAULT 'DEFAULT',
    "piece_theme" TEXT NOT NULL DEFAULT 'default',
    "engine_depth" INTEGER NOT NULL DEFAULT 18,
    "multi_pv" INTEGER NOT NULL DEFAULT 1,
    "preferred_engine" TEXT NOT NULL DEFAULT 'stockfish',
    "eval_display" "EvalDisplay" NOT NULL DEFAULT 'GRAPH',
    "animation_speed" TEXT NOT NULL DEFAULT 'normal',
    "keyboard_shortcuts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_statistics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "total_analyses" INTEGER NOT NULL DEFAULT 0,
    "total_games" INTEGER NOT NULL DEFAULT 0,
    "average_accuracy" DOUBLE PRECISION,
    "hours_analyzed" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "last_active" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "category" VARCHAR NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "status" VARCHAR NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "title" VARCHAR,
    "category" TEXT NOT NULL DEFAULT 'recent',
    "is_shared" BOOLEAN NOT NULL DEFAULT false,
    "analysis_type" "AnalysisType" NOT NULL DEFAULT 'GAME',
    "engine_version" TEXT NOT NULL DEFAULT 'stockfish_16.1',
    "engine_depth" INTEGER NOT NULL DEFAULT 18,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "accuracy" DOUBLE PRECISION,
    "last_opened" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_viewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "collection" VARCHAR,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "is_trash" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "analysis_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_games_players" ON "games"("white", "black");

-- CreateIndex
CREATE INDEX "idx_games_created_at" ON "games"("created_at");

-- CreateIndex
CREATE INDEX "idx_analysis_jobs_status" ON "analysis_jobs"("status");

-- CreateIndex
CREATE INDEX "idx_analysis_jobs_game" ON "analysis_jobs"("game_id");

-- CreateIndex
CREATE INDEX "idx_evaluations_fen" ON "move_evaluations"("fen");

-- CreateIndex
CREATE INDEX "idx_evaluations_analysis" ON "move_evaluations"("analysis_id");

-- CreateIndex
CREATE INDEX "idx_outbox_status_created" ON "outbox_events"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "processed_jobs_job_id_worker_name_key" ON "processed_jobs"("job_id", "worker_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_provider_auth_provider_id_key" ON "users"("auth_provider", "auth_provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_user_id_key" ON "user_statistics"("user_id");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_jobs" ADD CONSTRAINT "analysis_jobs_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move_evaluations" ADD CONSTRAINT "move_evaluations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analysis_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_sessions" ADD CONSTRAINT "analysis_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_sessions" ADD CONSTRAINT "analysis_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

