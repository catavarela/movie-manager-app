import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaService } from '../prisma.service'

export type MockPrismaContext = {
  service: DeepMockProxy<PrismaService>
}

export const createMockContext = (): MockPrismaContext => {
  return {
    service: mockDeep<PrismaService>(),
  }
}