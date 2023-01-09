
export interface Credit {
    applicationId: string
    preApproval: boolean
    documents?: Documents[]
    applicants: Applicants[]
    mortgage: Mortgage
}
  
export interface Documents {
    name: string
}

interface Applicants {
    creditScore: number
}

interface Mortgage {
    loanAmount: number
}

