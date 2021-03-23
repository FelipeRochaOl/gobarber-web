import styled, { keyframes } from 'styled-components'
import { shade } from 'polished'
import signInBackgroungImg from '../../assets/sign-in-background.svg'

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch; //itens com tamanho total (estica ao máximo)
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
`

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0)
  }
`

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    align-items: center;

    h1 {
      margin-bottom: 24px;
      font-weight: 500;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  // > indica que é somente o a(link) depois do form
  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;
    display: flex;
    align-items: center;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 16px;
    }
  }
`

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgroungImg}) no-repeat center;
  background-size: cover; //cobre o fundo de toda a div
`
