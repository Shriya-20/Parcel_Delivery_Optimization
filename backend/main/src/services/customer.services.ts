import { prisma } from "../db/db";

export async function getCustomerDetailsService(customer_id: string) {
  const customer = await prisma.customer.findUnique({
    where: {
      customer_id: customer_id
    }
  });
  if(!customer){
    return null;
  }
  return customer;
}

export async function sendEmailsToCustomersService(date:string){
    //here what we need is to get customers and ig make a service which sends emails to customers like kafka type thing
    const deliveries = await prisma.delivery.findMany({
        where: {
            delivery_date: date
        },
        include:{
            customer: true
        }
    });
    const customers= deliveries.map(delivery => delivery.customer);
    customers.forEach(customer => {
        //TODO->send email to customer
        console.log(`Sending email to ${customer.email}`);
    });
}