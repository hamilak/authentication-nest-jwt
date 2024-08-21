import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordResetTable1724235299773 implements MigrationInterface {
    name = 'CreatePasswordResetTable1724235299773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "password_reset" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "expiredAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "UQ_36e929b98372d961bb63bd4b4e9" UNIQUE ("token"),
                CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "password_reset"
            ADD CONSTRAINT "FK_05baebe80e9f8fab8207eda250c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "password_reset" DROP CONSTRAINT "FK_05baebe80e9f8fab8207eda250c"
        `);
        await queryRunner.query(`
            DROP TABLE "password_reset"
        `);
    }

}
