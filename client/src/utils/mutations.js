import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_ARCANA = gql`
  mutation addArcana($id: ID!) {
    addArcana(_id: $id) {
      arcana
    }
  }
`;

export const SUBTRACT_ARCANA = gql`
  mutation subtractArcana($id: ID!, $amount: Int!) {
    subtractArcana(_id: $id, amount: $amount) {
      arcana
    }
  }
`;

export const ADD_ESSENCE = gql`
  mutation addEssence($id: ID!) {
    addEssence(_id: $id) {
      essence
    }
  }
`;

export const SUBTRACT_ESSENCE = gql`
  mutation subtractEssence($id: ID!, $amount: Int!) {
    subtractEssence(_id: $id, amount: $amount) {
      essence
    }
  }
`;

export const ADD_SCALE = gql`
  mutation addScale($id: ID!) {
    addScale(_id: $id) {
      scale
    }
  }
`;

export const SUBTRACT_SCALE = gql`
  mutation subtractScale($id: ID!, $amount: Int!) {
    subtractScale(_id: $id, amount: $amount) {
      scale
    }
  }
`;

export const UPGRADE_RING_TIER = gql`
  mutation upgradeRingTier($id: ID!) {
    upgradeRingTier(_id: $id) {
      ring
    }
  }
`;

export const RESET_RING_TIER = gql`
  mutation resetRingTier($id: ID!) {
    resetRingTier(_id: $id) {
      ring
    }
  }
`;

export const UPGRADE_CLOAK_TIER = gql`
  mutation upgradeCloakTier($id: ID!) {
    upgradeCloakTier(_id: $id) {
      cloak
    }
  }
`;

export const RESET_CLOAK_TIER = gql`
  mutation resetCloakTier($id: ID!) {
    resetCloakTier(_id: $id) {
      ring
    }
  }
`;
