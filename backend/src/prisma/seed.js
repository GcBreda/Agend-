// backend/src/prisma/seed.js
// Popula o banco com dados de exemplo para desenvolvimento

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // ── Profissional ───────────────────────────────────────────
  const senhaHash = await bcrypt.hash('senha123', 12)

  const usuarioProf = await prisma.usuario.upsert({
    where: { email: 'ana.melo@agendo.app' },
    update: {},
    create: {
      nome:     'Dra. Ana Melo',
      email:    'ana.melo@agendo.app',
      cpf:      '111.111.111-11',
      senhaHash,
      telefone: '(11) 99999-0010',
      perfil:   'PROFISSIONAL',
      profissional: {
        create: {
          crp:          '06/12345',
          especialidade:'TCC',
          valorSessao:  180,
          duracaoPadrao: 50,
          bio:          'Psicóloga especializada em TCC e transtornos de ansiedade.',
          disponibilidades: {
            createMany: {
              data: [
                { diaSemana: 'SEGUNDA', horaInicio: '08:00', horaFim: '17:00' },
                { diaSemana: 'TERCA',   horaInicio: '08:00', horaFim: '17:00' },
                { diaSemana: 'QUARTA',  horaInicio: '08:00', horaFim: '17:00' },
                { diaSemana: 'QUINTA',  horaInicio: '08:00', horaFim: '17:00' },
                { diaSemana: 'SEXTA',   horaInicio: '08:00', horaFim: '14:00' }
              ]
            }
          }
        }
      }
    }
  })

  // ── Paciente ───────────────────────────────────────────────
  const usuarioPac = await prisma.usuario.upsert({
    where: { email: 'fernanda@agendo.app' },
    update: {},
    create: {
      nome:     'Fernanda Lima',
      email:    'fernanda@agendo.app',
      cpf:      '222.222.222-22',
      senhaHash,
      telefone: '(11) 99999-0003',
      perfil:   'PACIENTE',
      paciente: {
        create: {
          dataNascimento: new Date('2000-11-22'),
          planoSaude:     'Bradesco Saúde'
        }
      }
    }
  })

  console.log(`Profissional criado: ${usuarioProf.email}`)
  console.log(`Paciente criado:     ${usuarioPac.email}`)
  console.log('\nCredenciais de acesso (senha: senha123):')
  console.log(`  Profissional: ana.melo@agendo.app`)
  console.log(`  Paciente:     fernanda@agendo.app`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
