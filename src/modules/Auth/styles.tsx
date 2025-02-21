import styled, { css } from "styled-components";

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px;
  display: grid;
  justify-content: center;

  @media only screen and (max-width: 1024px) {
    width: 100%;
    display: block;
    padding: 16px;
  }
`;

export default {
  Container,
};
