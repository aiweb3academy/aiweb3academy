import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "members" ADD COLUMN "_verified" boolean;
  ALTER TABLE "members" ADD COLUMN "_verificationtoken" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "members" DROP COLUMN IF EXISTS "_verified";
  ALTER TABLE "members" DROP COLUMN IF EXISTS "_verificationtoken";`)
}
