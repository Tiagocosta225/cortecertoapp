const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const slug = 'barbearia-do-joao'

  const barbearia = await prisma.barbearia.upsert({
    where: { slug },
    update: {
      nome: 'Barbearia do João',
      endereco: 'Rua das Tesouras, 123',
      telefone: '(11) 99999-9999',
      descricao: 'Barbearia premium com atendimento rápido, reserva via link e confirmação por WhatsApp.',
      cidade: 'São Paulo',
      instagram: '@barbeariadojoao',
      whatsappLink: 'https://wa.me/5511999999999',
      horarioAbertura: '09:00',
      horarioFechamento: '18:00',
      ativa: true,
      aceitaReservaPix: true,
      taxaReservaPadrao: 10,
      tempoRetornoDias: 20,
      metaSemanal: 5000,
    },
    create: {
      nome: 'Barbearia do João',
      slug,
      endereco: 'Rua das Tesouras, 123',
      telefone: '(11) 99999-9999',
      descricao: 'Barbearia premium com atendimento rápido, reserva via link e confirmação por WhatsApp.',
      cidade: 'São Paulo',
      instagram: '@barbeariadojoao',
      whatsappLink: 'https://wa.me/5511999999999',
      horarioAbertura: '09:00',
      horarioFechamento: '18:00',
      ativa: true,
      aceitaReservaPix: true,
      taxaReservaPadrao: 10,
      tempoRetornoDias: 20,
      metaSemanal: 5000,
    },
  })

  await prisma.servico.deleteMany({
    where: { barbeariaId: barbearia.id },
  })

  await prisma.servico.createMany({
    data: [
      {
        nome: 'Corte Simples',
        descricao: 'Corte tradicional com máquina e tesoura.',
        preco: 25,
        duracaoMin: 30,
        barbeariaId: barbearia.id,
        ativo: true,
        destaqueLink: false,
        ordemLink: 1,
        depositoAntecipado: 5,
        categoria: 'corte',
        tempoRetornoDias: 20,
      },
      {
        nome: 'Corte + Barba',
        descricao: 'Corte completo com aparação de barba e acabamento.',
        preco: 45,
        duracaoMin: 45,
        barbeariaId: barbearia.id,
        ativo: true,
        destaqueLink: true,
        ordemLink: 2,
        depositoAntecipado: 10,
        categoria: 'combo',
        tempoRetornoDias: 20,
      },
      {
        nome: 'Barba',
        descricao: 'Aparação, desenho e finalização da barba.',
        preco: 20,
        duracaoMin: 20,
        barbeariaId: barbearia.id,
        ativo: true,
        destaqueLink: false,
        ordemLink: 3,
        depositoAntecipado: 5,
        categoria: 'barba',
        tempoRetornoDias: 15,
      },
    ],
  })

  console.log(`Seed concluído para ${barbearia.nome} (${barbearia.slug})`)
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
