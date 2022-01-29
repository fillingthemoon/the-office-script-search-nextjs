import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

const NavLink = ({ name, href, submenuItem, accordion }) => {
  return (
    <NextLink href={href}>
      <Link
        fontWeight={!submenuItem && 600}
        display="flex"
        py={accordion ? 4 : 3}
        px={accordion && submenuItem ? 14 : submenuItem ? 4 : accordion && 10}
        width={(submenuItem || accordion) && '100%'}
        color={submenuItem ? 'gray.400' : 'white.500'}
        borderBottom="2px solid transparent"
        _hover={{
          textDecoration: 'none',
          backgroundColor: submenuItem && 'gray.100',
          borderColor: !(submenuItem || accordion) && 'white.500',
        }}
      >
        {name}
      </Link>
    </NextLink>
  )
}

export default NavLink
