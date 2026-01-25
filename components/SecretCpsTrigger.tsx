"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SecretCpsTrigger() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (count >= 7) {
      router.push("/deals/cps/");
    }
  }, [count, router]);

  return (
    <h2
      className="text-lg font-semibold select-none"
      onClick={() => setCount((c) => c + 1)}
      style={{ cursor: "default" }}
    >
      CPS 链接替换
    </h2>
  );
}
