import { Credit } from 'src/interface/credit';
import { Client, Connection, WorkflowClient } from '@temporalio/client';
import { isBlockedQuery } from './workflows';
import fetch from "node-fetch";

export async function verifyFilesActivity(credit: Credit): Promise<boolean> {
  if (!credit) throw new Error('credit is required');

  console.log('entrou na função de verificação de arquivo');
  let filesNumbers = credit.documents.length;
  if (filesNumbers >= 5) {
    return true;
  }

  const connection = await Connection.connect({
    address: "temporal:7233"
  });

  const client = new WorkflowClient({
    connection
  });

  const handle = client.getHandle(credit.applicationId);
  console.log('blocked?', await handle.query(isBlockedQuery));

  return false;
}

export async function reviewCreditActivity(credit: Credit): Promise<boolean> {
  if (!credit) throw new Error('credit is required');

  console.log('Revising Credit');
  let creditReview = 0;

  for (const item of credit.applicants) {
    creditReview += item.creditScore;
  }

  if (creditReview < 600) {
    return false;
  }

  return true;
}

export async function notifyLO(credit: Credit): Promise<boolean> {
  if (!credit) throw new Error('credit is required');

  console.log("Preparing to Notifying LO")

  const acceptCredit = reviewCreditActivity(credit);
  if (!(await acceptCredit).valueOf()) {
    console.log("Notifying LO")
    const myUrl = 'https://webhook.site/3df03201-8945-42d3-8431-1602702ae548';
    const response = await fetch(myUrl, {
      method: 'POST',
      body: JSON.stringify(credit),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    return true
  }

  console.log("It's not necessary notify LO")
  return false;
}

export async function prepareLO(credit: Credit): Promise<boolean> {
  if (!credit) throw new Error('credit is required');

  console.log("preparing LO")
  return true;
}