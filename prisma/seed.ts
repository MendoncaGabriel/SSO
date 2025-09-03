import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const client = await db.client.create({
    data: {
      name: "sso",
      url: "http:localhost:3000"
    }
  })

  const permission = await db.permission.create({
    data: {
      name: "admin sso",
      clientId: client.id
    }
  })

  const actions = ["read", "write", "delete", "update"];
  const resources = ["user", "client", "permission", "role", "user-permission"];

  const rolesData = resources.flatMap(resource =>
    actions.map(action => ({
      action,
      resource,
      permissionId: permission.id,
    }))
  );

  const roles = await db.role.createMany({
    data: rolesData,
    skipDuplicates: true,
  });

  const user = await db.user.create({
    data: {
      costCenter: "",
      department: "p&d",
      displayName: "",
      email: "",
      employeeNum: "",
      firstName: "admin",
      fullName: "",
      lastName: "",
      location: "",
      manager: "",
      status: "",
      title: "",
    }
  })

  const userPermission = await db.userPermission.create({
    data: {
      userId: user.id,
      permissionId: permission.id
    }
  })

  
  console.log('Seed concluído!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
