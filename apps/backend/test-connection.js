const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Testando conexão com o banco...');
    
    // Teste de conexão básica
    await prisma.$connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Teste de query
    const result = await prisma.$queryRaw`SELECT version() as version, current_database() as db, now() as time`;
    console.log('📊 Informações do banco:', result[0]);
    
    // Verifique se a tabela users existe
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Tabelas disponíveis:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão encerrada');
  }
}

testConnection();