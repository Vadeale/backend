import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  token!: string;

  @Column({ type: 'text' })
  text!: string;

  @Column({ name: 'employer_email', type: 'varchar', length: 255 })
  employerEmail!: string;

  @Column({ name: 'public_contacts', type: 'varchar', length: 255 })
  publicContacts!: string;

  @Column({ type: 'varchar', length: 32, default: 'other' })
  category!: string;

  @Column({ type: 'varchar', length: 32, default: 'active' })
  status!: string;

  @Column({ type: 'int', default: 0 })
  responses!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image!: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
