package dev.marvin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakAdminClientService {
    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public UserRepresentation updateUserName(String userId, String firstName, String lastName) {
        try {
            log.info("Fetching user {} from Keycloak realm {}", userId, realm);
            UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();

            log.info("Current user name: {} {}", user.getFirstName(), user.getLastName());
            log.info("Updating user name to: {} {}", firstName, lastName);

            user.setFirstName(firstName);
            user.setLastName(lastName);

            keycloak.realm(realm).users().get(userId).update(user);
            log.info("Keycloak successfully updated name for user {}", userId);

            return keycloak.realm(realm).users().get(userId).toRepresentation();
        } catch (Exception e) {
            log.error("Keycloak failed to update name for user {}: {}", userId, e.getMessage(), e);
            throw new IllegalStateException(e.getMessage()); // rethrow if you want upstream handling
        }
    }

    public void resetPassword(String userId, String newPassword) {
        try {
            log.info("Resetting password for user {} in realm {}", userId, realm);
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setTemporary(false);
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(newPassword);

            keycloak.realm(realm).users().get(userId).resetPassword(credential);
            log.info("Keycloak successfully reset password for user {}", userId);

            log.info("Forcing re-login after password change");
            keycloak.realm(realm).users().get(userId).logout();
        } catch (Exception e) {
            log.error("Keycloak failed to reset password for user {}: {}", userId, e.getMessage(), e);
            throw new IllegalStateException(e.getMessage());
        }
    }
}
