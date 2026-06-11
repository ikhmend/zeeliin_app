import * as loansRepository from "..repository/loands.repository.js";
export async function getLoans(){
    return await loansRepository.getLoans();
}