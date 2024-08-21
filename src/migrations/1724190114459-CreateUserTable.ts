import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1724190114459 implements MigrationInterface {
    name = 'CreateUserTable1724190114459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('SuperAdmin', 'Admin', 'User')
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'User',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
    }

}
