"use client";

import { TABLES } from "@/lib/supabase/db";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "PLACEHOLDER";
const supabaseSecretServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_SECRET || "PLACEHOLDER";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseSecretServiceKey) {
    console.error("Supabase environment variables not set!");
    return NextResponse.error();
  }

  const supabase = createClient(supabaseUrl, supabaseSecretServiceKey);

  const { cardId } = (await request.json()) as { cardId: string };

  // Check if card exists first
  const { data: cardData, error: fetchError } = await supabase
    .from(TABLES.CARDS)
    .select("id")
    .eq("id", cardId)
    .single();

  if (fetchError || !cardData) {
    console.error("Error fetching card or card not found:", fetchError);
    return NextResponse.error();
  }

  const { data, error } = await supabase
    .from(TABLES.CARDS)
    .update({ likes: supabase.raw("likes + ?", [1]) })
    .eq("id", cardId);

  if (error) {
    console.error("Error while updating likes:", error);
    return NextResponse.error();
  }

  return NextResponse.json({ message: "Likes updated successfully.", data });
}
