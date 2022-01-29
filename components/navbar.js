import NextLink from 'next/link'
import NavLink from './navlink'

import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Text,
  IconButton,
  useDisclosure,
  Accordion,
  AccordionItem,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

const links = [
  {
    name: 'Search',
    href: '/',
  },
  {
    name: 'All Episodes',
    href: '/all-episodes',
  },
]

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box bg="primary.500" shadow="md" position="sticky" zIndex={2} top={0}>
      <Box px={4} py={{ base: 4, lg: 6 }}>
        <Container maxW="container.xl">
          <Flex
            h={16}
            align="center"
            justify={{ base: 'space-between', lg: 'flex-start' }}
          >
            <IconButton
              icon={
                isOpen ? (
                  <CloseIcon fontSize="18px" />
                ) : (
                  <HamburgerIcon fontSize="25px" />
                )
              }
              aria-label={'Open Menu'}
              display={{ lg: 'none' }}
              onClick={isOpen ? onClose : onOpen}
              backgroundColor="primary.500"
              color="white.500"
              transition="0.2s"
              _hover={{
                transform: 'scale(1.2)',
                transition: '0.2s',
              }}
            />
            <HStack spacing={20}>
              <NextLink href="/" passHref>
                <Link>
                  <HStack spacing={4}>
                    <Text
                      color="white.500"
                      fontSize={{ base: '1.2rem', lg: '1.5rem' }}
                      fontFamily="Roboto Mono"
                      display="inline-block"
                    >
                      The Office
                    </Text>
                    <Text
                      color="white.500"
                      fontSize={{ base: '1.2rem', lg: '1.5rem' }}
                      fontWeight={700}
                      display="inline-block"
                    >
                      Script Search
                    </Text>
                  </HStack>
                </Link>
              </NextLink>
              <HStack
                spacing={6}
                display={{ base: 'none', lg: 'flex' }}
                fontSize="1.1rem"
              >
                {links.map((link, i) => {
                  return <NavLink key={i} name={link.name} href={link.href} />
                })}
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Accordion menu */}
      {isOpen ? (
        <Box display={{ lg: 'none' }}>
          <Accordion allowToggle fontSize="1.1rem" mb={4}>
            {links.map((link, i) => {
              return (
                <AccordionItem key={i} borderColor="primary.200">
                  <NavLink name={link.name} href={link.href} accordion={true} />
                </AccordionItem>
              )
            })}
          </Accordion>
        </Box>
      ) : null}
    </Box>
  )
}

export default Navbar
