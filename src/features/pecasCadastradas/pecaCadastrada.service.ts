import { PecaCadastradaRepository } from "./pecaCadastrada.repository";
import {
    PecaCadastradaGetAllResponseType,
    PecaCadastradaGetByBolsaIdResponseType,
    PecaCadastradaGetByCodigoDaPecaResponseType,
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

    async getByCodigoDaPeca(
        codigoDaPeca: string
    ): Promise<PecaCadastradaGetByCodigoDaPecaResponseType> {
        return this.PecaCadastradaRepository.getByCodigoDaPeca(codigoDaPeca);
    }
}
