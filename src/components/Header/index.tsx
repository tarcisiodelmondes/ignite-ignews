import styles from "./styles.module.scss";
import Image from "next/image";

import { SignInButton } from "../SignInButton";
import { useRouter } from "next/router";
import { ActiveLink } from "../ActiveLink";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/logo.svg"
            alt="Logo ig.news"
            width="108px"
            height="30px"
          />
        </div>

        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>

          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
