import { SetorRepository } from "./setor.repository";
import { SetorType } from "./setor.schema";

import { SetorResponseType } from "./setor.schema";
import { SetorGetAllResponseType } from "./setor.schema";

export class SetorService {
    constructor(private setorRepository: SetorRepository) {}

    async getAll(): Promise<SetorGetAllResponseType> {
        return this.setorRepository.getAll();
    }

    async getById(setorId: number): Promise<SetorResponseType | null> {
        return this.setorRepository.getById({ setorId });
    }

    async create(data: { nome: string }): Promise<SetorType> {
        return this.setorRepository.create(data);
    }

    async update(data: { setorId: number; nome: string }): Promise<SetorType> {
        const { setorId } = data;

        const setorExists = await this.setorRepository.getById({ setorId });

        if (!setorExists) {
            throw new Error("Setor não encontrado");
        }

        return this.setorRepository.update({ ...data });
    }

    async delete(setorId: number): Promise<boolean> {
        const setorExists = await this.setorRepository.getById({ setorId });

        if (!setorExists) {
            throw new Error("Setor não encontrado");
        }

        return this.setorRepository.delete({ setorId });
    }
}
