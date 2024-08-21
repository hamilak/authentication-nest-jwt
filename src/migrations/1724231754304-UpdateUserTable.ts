import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1724231754304 implements MigrationInterface {
    name = 'UpdateUserTable1724231754304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "refreshToken" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "refreshToken"
        `);
    }

}
