'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm({
  initialKeyword = '',
}: {
  initialKeyword?: string;
}) {
  const [keyword, setKeyword] =
    useState(initialKeyword);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(
        keyword
          ? `/youtube?q=${encodeURIComponent(keyword)}`
          : '/youtube'
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, router]);

  return (
    <input
      type="text"
      value={keyword}
      onChange={(e) =>
        setKeyword(e.target.value)
      }
      placeholder="動画を検索"
      className="mb-6 w-full rounded-lg border p-2"
    />
  );
}