import { PecaCadastradaRepository } from "./pecaCadastrada.repository";
import {
    PecaCadastradaGetAllResponseType,
    PecaCadastradaGetByBolsaIdResponseType,
    PecaCadastradaUpdateResponseType,
} from "./pecaCadastrada.schema";

export class PecaCadastradaService {
    constructor(private PecaCadastradaRepository: PecaCadastradaRepository) {}

    async getAll(): Promise<PecaCadastradaGetAllResponseType> {
        return this.PecaCadastradaRepository.getAll();
    }

    async getByBolsaId(
        bolsaId: number
    ): Promise<PecaCadastradaGetByBolsaIdResponseType> {
        return this.PecaCadastradaRepository.getByBolsaId({ bolsaId });
    }

    async create(data: {
        codigoDaPeca: string[];
        bolsaId: number;
    }): Promise<boolean> {
        return this.PecaCadastradaRepository.create(data);
    }

    async delete(pecaCadastradaId: number): Promise<boolean> {
        return this.PecaCadastradaRepository.delete({ pecaCadastradaId });
    }
    async update(data: {
        pecaCadastradaId: number;
        codigoDaPeca: string;
    }): Promise<PecaCadastradaUpdateResponseType> {
        return this.PecaCadastradaRepository.update(data);
    }
}
